import React from "react";

/**
 * Catches render errors in a tool section so one crashing tab
 * doesn't white-screen the whole app.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <section className="card">
          <h2 className="section-header">
            <span className="text-2xl">⚠️</span> Something went wrong
          </h2>
          <p className="text-sm text-gray-700 mb-4">
            {String(this.state.error?.message || this.state.error)}
          </p>
          <button
            className="copy-btn"
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
        </section>
      );
    }
    return this.props.children;
  }
}
