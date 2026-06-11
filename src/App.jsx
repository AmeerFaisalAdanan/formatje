import React, { lazy, Suspense, useState } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Each tool loads its own chunk on demand so heavy editor/highlighter
// dependencies are only fetched for the active tab.
const FormatterSection = lazy(() =>
  import("./components/FormatterSection").then((m) => ({
    default: m.FormatterSection,
  }))
);
const CompareSection = lazy(() =>
  import("./components/CompareSection").then((m) => ({
    default: m.CompareSection,
  }))
);
const JsonToCurlSection = lazy(() =>
  import("./components/JsonToCurlSection").then((m) => ({
    default: m.JsonToCurlSection,
  }))
);
const HashGenerator = lazy(() =>
  import("./components/HashGenerator").then((m) => ({
    default: m.HashGenerator,
  }))
);

const TABS = [
  { id: "formatter", label: "🎨 Formatter", Component: FormatterSection },
  { id: "compare", label: "🔍 Compare", Component: CompareSection },
  { id: "curl", label: "🌀 JSON to cURL", Component: JsonToCurlSection },
  { id: "hash", label: "🔑 Hash Generator", Component: HashGenerator },
];

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const { Component: ActiveSection } =
    TABS.find((tab) => tab.id === activeTab) ?? TABS[0];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            formatje
          </h1>
          <p className="text-white/80">
            Format, compare, and convert developer tools
          </p>
        </header>

        <div className="tab-nav justify-center">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <ErrorBoundary key={activeTab}>
            <Suspense
              fallback={
                <section className="card text-center text-gray-500">
                  Loading…
                </section>
              }
            >
              <ActiveSection />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
