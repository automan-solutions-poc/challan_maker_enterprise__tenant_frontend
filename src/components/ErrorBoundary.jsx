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
        <div className="p-5 text-center">
          <h2>Something went wrong</h2>
          <p className="text-muted">Please refresh the page or sign in again.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
