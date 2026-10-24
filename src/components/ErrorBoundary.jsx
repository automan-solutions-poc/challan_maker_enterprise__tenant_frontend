import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("UI error:", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex align-items-center justify-content-center p-4" style={{ minHeight: "100vh" }}>
          <div className="surface surface-pad text-center" style={{ maxWidth: 420 }}>
            <h1 className="font-display mb-2" style={{ fontSize: "2rem" }}>Something went wrong</h1>
            <p className="text-muted mb-4">Please reload the page. If it keeps happening, sign in again.</p>
            <div className="d-flex gap-2 justify-content-center">
              <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
                Reload page
              </button>
              <a href="/login" className="btn btn-secondary">
                Sign in
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
